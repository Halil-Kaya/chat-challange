export class PaginationInfo {
  offset?: number; //ne kadar ilerledi
  page?: number; // Getirilecek sayfa
  limit?: number; // Getirilecek kayıt sayısı
  totalItemCount?: number; // Toplam kayıt sayısı.
  count?: number; // Toplam sayfa sayısı.
  hasNext?: boolean; // Sonraki sayfa bayrağı.
}