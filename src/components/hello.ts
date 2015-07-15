/// <reference path="../../typings/angular2/angular2.d.ts" />

import {Component, View} from 'angular2/angular2';

import {GreeterService} from '../services/greeter';

@Component({
    selector: 'hello',
    properties: ['name'],
    viewInjector: [GreeterService]
})
@View({
    templateUrl: 'templates/hello.html'
})
export class HelloComponent {
    name: string;
    greeter: GreeterService;
    
    constructor(greeter:GreeterService) {
        this.greeter = greeter;
    }
}