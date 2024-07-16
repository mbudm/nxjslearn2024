import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { redirect } from 'next/navigation'
import { headers } from "next/headers";
import { fetchInvoicesPages } from '@/app/lib/data';

type SearchParams = {
  query?: string;
  page?: string
}

interface PageProps {
  searchParams?: SearchParams;
}

const getCurrentPage = (totalPages: number, searchParam?: number) => {
  if (searchParam !== undefined && searchParam <= totalPages) {
    return searchParam
  } else if (searchParam !== undefined && searchParam > totalPages) {
    return totalPages
  } else {
    return 1
  }
}
 
export default async function Page({
  searchParams,
}: PageProps) {
  const query = searchParams?.query || '';
  const totalPages = await fetchInvoicesPages(query);
  const currentPage = getCurrentPage(totalPages, Number(searchParams?.page))

  if (Number(searchParams?.page) && currentPage !== Number(searchParams?.page) ){
    const headersList = headers();
    const redirectUrl = `${headersList.get("x-pathname")}?query=${searchParams?.query || ''}&page=${currentPage}`;

    // overwrites the current page but should push?
    redirect(redirectUrl)
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}