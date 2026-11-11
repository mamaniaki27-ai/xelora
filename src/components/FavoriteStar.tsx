import { Star } from 'lucide-react';
import { useTradeStore } from '../stores/trade';

export default function FavoriteStar({ id }: { id: string }) {
  const trade = useTradeStore();
  const active = trade.isFavorite(id);

  return (
    <button
      type="button"
      className="grid h-8 w-8 shrink-0 place-items-center rounded-none"
      aria-pressed={active}
      aria-label="Recommend"
      onClick={(event) => {
        event.stopPropagation();
        trade.toggleFavorite(id);
      }}
    >
      <Star
        className={`h-4 w-4 ${active ? 'text-[#f5c518]' : 'text-muted'}`}
        fill={active ? '#f5c518' : 'none'}
        stroke={active ? '#f5c518' : 'currentColor'}
      />
    </button>
  );
}
