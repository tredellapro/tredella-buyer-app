export function formatReviewCount(count: number) {
  if (count > 100) {
    return "99+";
  }
  return count;
}
