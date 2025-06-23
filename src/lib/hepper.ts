export function toSlug(str: string) {
  return str
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .toLowerCase()
    .replace(/\s+/g, "-") // thay dấu cách bằng -
    .replace(/[^a-z0-9\-]/g, "") // chỉ giữ a-z, 0-9, -
    .replace(/\-+/g, "-") // bỏ trùng dấu -
    .replace(/^\-+|\-+$/g, ""); // bỏ - ở đầu/cuối
}
