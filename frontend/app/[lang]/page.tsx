import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import PageClient from './page-client'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return <PageClient dictionary={dictionary} lang={lang} />
}
