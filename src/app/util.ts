export class Util {

  private static readonly MS_24H = 60 * 60 * 24 * 1000; // 24h

  private constructor() { }

  public static isNumeric(n: any): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  public static isOlderThan24h(date: string): boolean {
    return (new Date().getTime() - new Date(date).getTime()) > Util.MS_24H;
  }

  public static formatDate(date: Date): string {
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();

    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
  }
}
