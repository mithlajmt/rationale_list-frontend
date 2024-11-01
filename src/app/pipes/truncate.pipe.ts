import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string,limit:number =100 , completeText:boolean): string {
    if(!value){
      return '';
    }
    return completeText || value.length <= limit ? value : `${value.slice(0, limit)}...`;
    }

}
