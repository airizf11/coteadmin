// coteadmin/src/components/ItemCartPicker.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ReceiptText, Trash2, Plus, Minus } from 'lucide-react';
import { formatRupiah } from '@/lib/format';
import { cn } from '@/lib/utils';

type Item = { id: string; name: string; price: number; cogs: number };
type CartLine = { itemId: string; itemName: string; qty: number; price: number; cogs: number };

export function ItemCartPicker({
  items, cart, onAddItem, onSetQty, onRemoveItem,
}: {
  items: Item[];
  cart: Record<string, CartLine>;
  onAddItem: (item: Item) => void;
  onSetQty: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
}) {
  const cartLines = Object.values(cart);

  return (
    <>
      <div className="space-y-3">
        <div className="text-sm font-semibold flex items-center gap-2"><ShoppingCart size={16}/> Pilih Layanan</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item) => {
            const inCart = cart[item.id];
            return (
              <Card
                key={item.id}
                onClick={() => onAddItem(item)}
                className={cn(
                  'relative cursor-pointer transition-all active:scale-[0.98] select-none',
                  inCart
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30 hover:shadow-sm',
                )}
              >
                {inCart && (
                  <span className="absolute top-1.5 right-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                    {inCart.qty}
                  </span>
                )}
                <CardContent className="p-4 flex flex-col justify-center items-center text-center gap-1.5 h-full">
                  <div className="font-medium text-sm leading-tight text-foreground">{item.name}</div>
                  <Badge variant="secondary" className="font-bold text-[10px]">{formatRupiah(item.price)}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {cartLines.length > 0 && (
        <div className="space-y-3 bg-muted/30 -mx-4 p-4 border-y border-border">
          <div className="text-sm font-semibold flex items-center gap-2"><ReceiptText size={16}/> Keranjang</div>
          <ul className="space-y-2">
            {cartLines.map((line) => (
              <li key={line.itemId} className="flex justify-between items-center bg-background p-3 rounded-xl border border-border shadow-sm">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{line.itemName}</div>
                  <div className="text-xs text-muted-foreground">
                     {formatRupiah(line.price)} × {line.qty} = <span className="font-semibold text-foreground">{formatRupiah(line.price * line.qty)}</span>
                   </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => onSetQty(line.itemId, Math.max(0, line.qty - 1))}>
                    <Minus size={14} />
                  </Button>
                  <Input
                    type="number" step="0.1" min="0.1" value={line.qty}
                    onChange={(e) => onSetQty(line.itemId, Number(e.target.value))}
                    className="w-14 h-8 text-center text-sm font-medium px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => onSetQty(line.itemId, line.qty + 1)}>
                    <Plus size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onRemoveItem(line.itemId)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}