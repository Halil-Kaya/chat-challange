export class PaginationInfo {
  offset?: number; //ne kadar ilerledi
  page?: number; // Getirilecek sayfa
  limit?: number; // Getirilecek kayıt sayısı
  totalItemCount?: number; // Toplam kayıt sayısı.
  itemCount?: number; // Sayfa başı kayıt sayısı.
  count?: number; // Toplam sayfa sayısı.
  current?: number; // Aktif sayfa sayısı.
  hasNext?: boolean; // Sonraki sayfa bayrağı.
  next?: number; // Sonraki sayfa numarası.
  hasPrev?: boolean; // Önceki sayfa bayrağı.
  prev?: number; // Önceki sayfa numarası.
}