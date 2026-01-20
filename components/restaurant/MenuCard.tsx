"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, MessageCircle } from "lucide-react";
import { MenuItem, Locale } from "@/lib/restaurant/types";

export function MenuCard({
    item,
    locale,
    onOrder
}: {
    item: MenuItem;
    locale: Locale;
    onOrder: (item: MenuItem) => void;
}) {
    const isRtl = locale === 'ar';

    return (
        <div className="group relative bg-zinc-900/40 border border-white/5 rounded-[24px] overflow-hidden hover:bg-zinc-900/60 transition-all duration-300">
            <div className="aspect-[4/3] relative overflow-hidden">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name[locale]}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-600">
                        No Image
                    </div>
                )}
                {/* Price Tag Overlay */}
                <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white font-bold text-sm`}>
                    {item.price} SAR
                </div>
            </div>

            <div className="p-5">
                <div className={isRtl ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {item.name[locale]}
                    </h3>
                    <p className="mt-2 text-zinc-400 text-xs leading-relaxed line-clamp-2">
                        {item.description[locale]}
                    </p>
                </div>

                <div className="mt-6 flex items-center gap-2">
                    <button
                        onClick={() => onOrder(item)}
                        className="flex-1 h-12 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                    >
                        <MessageCircle size={18} />
                        {locale === 'ar' ? "اطلب الآن" : "Order Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}
