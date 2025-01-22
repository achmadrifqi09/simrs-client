import * as React from 'react'; // Mengimpor React untuk menggunakan JSX dan komponen React

import { cn } from '@/lib/utils'; // Mengimpor fungsi 'cn' untuk menggabungkan className (biasanya digunakan dengan Tailwind CSS)

// Komponen Table untuk menampilkan tabel
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    // Menerima properti className dan props lainnya dan meneruskannya ke elemen tabel
    ({ className, ...props }, ref) => (
        <div className="relative w-full overflow-auto z-0"> {/* Membungkus tabel dalam div dengan overflow untuk scroll */}
            <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
        </div>
    )
);
Table.displayName = 'Table'; // Menetapkan nama komponen untuk debugging

// Komponen TableHeader untuk bagian header tabel
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    // Menerima properti className dan props lainnya dan meneruskannya ke elemen thead
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={cn('[&_tr]:border-b border-t', className)} {...props} />
    )
);
TableHeader.displayName = 'TableHeader'; // Menetapkan nama komponen untuk debugging

// Komponen TableBody untuk bagian body tabel
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    // Menerima properti className dan props lainnya dan meneruskannya ke elemen tbody
    ({ className, ...props }, ref) => (
        <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
    )
);
TableBody.displayName = 'TableBody'; // Menetapkan nama komponen untuk debugging

// Komponen TableFooter untuk bagian footer tabel
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    // Menerima properti className dan props lainnya dan meneruskannya ke elemen tfoot
    ({ className, ...props }, ref) => (
        <tfoot
            ref={ref}
            className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
            {...props}
        />
    )
);
TableFooter.displayName = 'TableFooter'; // Menetapkan nama komponen untuk debugging

// Komponen TableRow untuk baris dalam tabel
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn('border-b border-t border-l border-r border-gray-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
            {...props}
        />
    )
);
TableRow.displayName = 'TableRow'; // Menetapkan nama komponen untuk debugging

// Komponen TableHead untuk sel header tabel
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    // Menerima properti className dan props lainnya dan meneruskannya ke elemen th
    ({ className, ...props }, ref) => (
        <th
            ref={ref}
            className={cn(
                'h-12 px-4 text-left align-middle font-medium text-sm leading-relaxed [&:has([role=checkbox])]:pr-0',
                className
            )}
            {...props}
        />
    )
);
TableHead.displayName = 'TableHead'; // Menetapkan nama komponen untuk debugging

// Komponen TableCell untuk sel dalam tabel
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td ref={ref} className={cn('p-4 align-middle border-l border-t border-r border-gray-300', className)} {...props} />
    )
);
TableCell.displayName = 'TableCell'; // Menetapkan nama komponen untuk debugging

// Komponen TableCaption untuk keterangan tabel
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
    // Menerima properti className dan props lainnya dan meneruskannya ke elemen caption
    ({ className, ...props }, ref) => (
        <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
    )
);
TableCaption.displayName = 'TableCaption'; // Menetapkan nama komponen untuk debugging

// Mengekspor semua komponen agar dapat digunakan di tempat lain
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
