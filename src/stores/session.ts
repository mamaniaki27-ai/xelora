import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const storageKey = 'xelora-wallet-address';
const walletKey = 'xelora-wallet-name';

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
};

function provider(): EthereumProvider | null {
  if (typeof window === 'undefined') return null;
  const eth = (window as Window & { ethereum?: EthereumProvider }).ethereum;
  return eth ?? null;
}

export const useSessionStore = defineStore('session', () => {
  const address = ref<string | null>(
    typeof localStorage === 'undefined' ? null : localStorage.getItem(storageKey),
  );
  const modalOpen = ref(false);
  const gateOpen = ref(false);
  const pickerOpen = ref(false);
  const connecting = ref(false);
  const error = ref('');
  const walletName = ref<string | null>(
    typeof localStorage === 'undefined' ? null : localStorage.getItem(walletKey),
  );

  const shortAddress = computed(() => {
    const value = address.value;
    if (!value) return '';
    return `${value.slice(0, 6)}…${value.slice(-4)}`;
  });

  function openModal() {
    modalOpen.value = true;
  }

  function closeModal() {
    modalOpen.value = false;
  }

  function openGate() {
    error.value = '';
    pickerOpen.value = false;
    gateOpen.value = true;
  }

  function closeGate() {
    gateOpen.value = false;
    pickerOpen.value = false;
    modalOpen.value = false;
  }

  function openPicker() {
    error.value = '';
    pickerOpen.value = true;
  }

  function closePicker() {
    pickerOpen.value = false;
  }

  function applyAccount(next: string | null) {
    address.value = next;
    if (next) localStorage.setItem(storageKey, next);
    else localStorage.removeItem(storageKey);
  }

  function connectPreview(name: string, account: string) {
    error.value = '';
    connecting.value = true;
    window.setTimeout(() => {
      walletName.value = name;
      localStorage.setItem(walletKey, name);
      applyAccount(account);
      modalOpen.value = false;
      gateOpen.value = false;
      pickerOpen.value = false;
      connecting.value = false;
    }, 650);
  }

  async function connectWallet() {
    error.value = '';
    const eth = provider();
    if (!eth) {
      error.value = 'No browser wallet was found. Install MetaMask or another injected wallet, then connect again.';
      modalOpen.value = true;
      return;
    }
    connecting.value = true;
    try {
      const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
      const next = accounts?.[0];
      if (!next) throw new Error('The wallet did not return an account.');
      applyAccount(next);
      modalOpen.value = false;
      gateOpen.value = false;
      pickerOpen.value = false;
      eth.on?.('accountsChanged', (...args: unknown[]) => {
        const list = args[0] as string[];
        applyAccount(list?.[0] ?? null);
      });
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'The wallet rejected the connection.';
      modalOpen.value = true;
    } finally {
      connecting.value = false;
    }
  }

  function disconnect() {
    walletName.value = null;
    localStorage.removeItem(walletKey);
    applyAccount(null);
  }

  return {
    address,
    shortAddress,
    modalOpen,
    gateOpen,
    pickerOpen,
    connecting,
    error,
    walletName,
    openModal,
    closeModal,
    openGate,
    closeGate,
    openPicker,
    closePicker,
    connectWallet,
    connectPreview,
    disconnect,
  };
});
