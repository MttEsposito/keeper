import { trigger, transition, style, query, animate } from "@angular/animations";

export const fades = trigger('routeAnimations', [
    transition('* <=> *', [
        query(':leave', style({ position: 'absolute', left: 0, right: 0, opacity: 1 }), { optional: true }),
        query(':enter', style({ position: 'absolute', left: 0, right: 0, opacity: 0 }), { optional: true }),
        query(':leave', animate('0.4s', style({ opacity: 0 })), { optional: true }),
        query(':enter', animate('0.4s', style({ opacity: 1 })), { optional: true })
    ])
]);