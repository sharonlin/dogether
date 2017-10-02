import {Pipe, PipeTransform} from '@angular/core';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/

const enum Type {
  TestName = 1,
  ClassName=2,
  ClassNameOnly=3
}

@Pipe({name: 'exponentialStrength'})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: string, type: Type): string {
    if (type == Type.TestName) {
      return value.split('#')[1];
    } else if (type == Type.ClassName) {
      return value.split('#')[0];
    } else {
      if (type==Type.ClassNameOnly || !type){
        let splitted = value.split('.');
        return splitted[splitted.length-1];
      }
    }
  }
}
