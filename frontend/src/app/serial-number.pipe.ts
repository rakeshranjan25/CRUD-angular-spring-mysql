// serial-number.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serialNumber'
})
export class SerialNumberPipe implements PipeTransform {
  transform(value: any, index: number): string {
    return `Serial ${index + 1}: ${value.details}`;
  }
}
