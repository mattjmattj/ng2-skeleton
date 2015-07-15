/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';

import {HelloComponent} from './components/hello';

@Component({
    selector: 'application'
})
@View({
    templateUrl: 'templates/application.html',
    directives: [HelloComponent]
})
export default class ApplicationComponent {
    constructor() {
        
    }
}

bootstrap(ApplicationComponent);