import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatSKU } from '../../utils/formatters';
import { GripVertical, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

export default function SortableProductRow({ product, onEdit, onDelete, formatPrice }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`hover:bg-brand-charcoal transition-colors duration-200 group ${isDragging ? 'bg-brand-charcoal shadow-xl' : ''}`}
    >
      <td className="px-4 py-4 w-10">
        <button 
          className="p-1.5 text-stone-600 hover:text-brand-gold cursor-grab active:cursor-grabbing transition-colors"
          {...attributes} 
          {...listeners}
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-stone-900 border border-brand-border/50 overflow-hidden flex-shrink-0">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-stone-600" /></div>
            )}
          </div>
          <div>
            <div className="font-serif text-white tracking-wide group-hover:text-brand-gold transition-colors">{product.title}</div>
            <div className="text-[10px] text-stone-500 font-bold tracking-wider mt-1">{formatSKU(product.id)}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-block px-2.5 py-1 bg-brand-charcoal border border-brand-border text-[10px] uppercase tracking-widest text-stone-400 rounded-sm">
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4 text-stone-300 font-medium">
        {formatPrice(product.price)}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onEdit(product)}
            className="p-2 text-stone-500 hover:text-brand-gold transition-colors duration-200"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="p-2 text-stone-500 hover:text-rose-500 transition-colors duration-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
