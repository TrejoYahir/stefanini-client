export class PaginatedList {
  constructor(
    public list: any[],
    public total: number,
    public limit: number,
    public currentPage: number) {}

    get pageTotal() {
      return this.total / this.limit;
    }

    // this method allows me to know if I can keep showing the 'Show more' button
    get remainingPages() {
      return Math.ceil((this.total - this.list.length) / this.limit);
    }

}
