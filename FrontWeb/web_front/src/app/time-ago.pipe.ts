import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  
  private translations: any = {
    'seconds': 'ثوانٍ',
    'minute': 'دقيقة',
    'minutes': 'دقائق',
    'hour': 'ساعة',
    'hours': 'ساعات',
    'day': 'يوم',
    'days': 'أيام',
    'month': 'شهر',
    'months': 'أشهر',
    'year': 'سنة',
    'years': 'سنوات'
  };

  transform(value: any): string {
    const timeAgo = formatDistanceToNow(new Date(value), { addSuffix: true });;
    return this.translateTimeAgo(timeAgo);
  }

  private translateTimeAgo(timeAgo: string): string {
    const [amount, unit, ...rest] = timeAgo.split(' ');
    const translatedUnit = this.translations[unit] || unit;
    return `مضت ${amount} ${translatedUnit} `;
  }

}
