import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const storageKey = 'xelora-wallet-address';
const walletKey = 'xelora-wallet-name';

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
};

type SessionValue = {
  address: string | null;
  shortAddress: string;
  modalOpen: boolean;
  gateOpen: boolean;
  pickerOpen: boolean;
  connecting: boolean;
  error: string;
  setError: (message: string) => void;
  walletName: string | null;
  openModal: () => void;
  closeModal: () => void;
  openGate: () => void;
  closeGate: () => void;
  openPicker: () => void;
  closePicker: () => void;
  connectWallet: () => Promise<void>;
  connectPreview: (name: string, account: string) => void;
  disconnect: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

function provider(): EthereumProvider | null {
  if (typeof window === 'undefined') return null;
  const eth = (window as Window & { ethereum?: EthereumProvider }).ethereum;
  return eth ?? null;
}

function readStorage(key: string) {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(readStorage(storageKey));
  const [modalOpen, setModalOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [walletName, setWalletName] = useState<string | null>(readStorage(walletKey));

  const value = useMemo<SessionValue>(() => {
    function applyAccount(next: string | null) {
      setAddress(next);
      if (next) localStorage.setItem(storageKey, next);
      else localStorage.removeItem(storageKey);
    }

    return {
      address,
      shortAddress: address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '',
      modalOpen,
      gateOpen,
      pickerOpen,
      connecting,
      error,
      setError,
      walletName,
      openModal: () => setModalOpen(true),
      closeModal: () => setModalOpen(false),
      openGate: () => {
        setError('');
        setPickerOpen(false);
        setGateOpen(true);
      },
      closeGate: () => {
        setGateOpen(false);
        setPickerOpen(false);
        setModalOpen(false);
      },
      openPicker: () => {
        setError('');
        setPickerOpen(true);
      },
      closePicker: () => setPickerOpen(false),
      connectPreview: (name: string, account: string) => {
        setError('');
        setConnecting(true);
        window.setTimeout(() => {
          setWalletName(name);
          localStorage.setItem(walletKey, name);
          applyAccount(account);
          setModalOpen(false);
          setGateOpen(false);
          setPickerOpen(false);
          setConnecting(false);
        }, 650);
      },
      connectWallet: async () => {
        setError('');
        const eth = provider();
        if (!eth) {
          setError('No browser wallet was found. Install MetaMask or another injected wallet, then connect again.');
          setModalOpen(true);
          return;
        }
        setConnecting(true);
        try {
          const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
          const next = accounts?.[0];
          if (!next) throw new Error('The wallet did not return an account.');
          applyAccount(next);
          setModalOpen(false);
          setGateOpen(false);
          setPickerOpen(false);
          eth.on?.('accountsChanged', (...args: unknown[]) => {
            const list = args[0] as string[];
            applyAccount(list?.[0] ?? null);
          });
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'The wallet rejected the connection.');
          setModalOpen(true);
        } finally {
          setConnecting(false);
        }
      },
      disconnect: () => {
        setWalletName(null);
        localStorage.removeItem(walletKey);
        applyAccount(null);
      },
    };
  }, [address, modalOpen, gateOpen, pickerOpen, connecting, error, walletName]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionStore() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSessionStore must be used within SessionProvider');
  return value;
}
