export class PaginatedList {
  constructor(
    public list: any[],
    public total: number,
    public limit: number,
    public currentPage: number) {}

    get pageTotal() {
      return this.total / this.limit;
    }

    get remainingPages() {
      return Math.ceil((this.total - this.list.length) / this.limit);
    }

}
