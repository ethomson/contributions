import { JSDOM } from 'jsdom';

export class ContributionDay {
    private date: string;
    private count: number;
    private color: string;
    private intensity: number;

    constructor(date: string, count: number, color: string, intensity: number) {
        this.date = date;
        this.count = count;
        this.color = color;
        this.intensity = intensity;
    }

    getDate(): string {
        return this.date;
    }

    getCount(): number {
        return this.count;
    }

    getColor(): string {
        return this.color;
    }

    getIntensity(): number {
        return this.intensity;
    }
}

export class Contributions {
    private count: number | undefined;
    private days: ContributionDay[];

    private constructor(count: number | undefined, days: ContributionDay[]) {
        this.count = count;
        this.days = days;
    }

    getDays(): ContributionDay[] {
        return this.days.slice(0);
    }

    private static normalizeBackground(bg: string) {
        if (bg.match(/^#[a-zA-Z0-9]{6}$/)) {
            return bg.toLowerCase();
        }

        let rgb = bg.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*\d+)?\s*\)$/i);

        if (rgb) {
            const r = parseInt(rgb[1]).toString(16);
            const g = parseInt(rgb[2]).toString(16);
            const b = parseInt(rgb[3]).toString(16);

            return '#' +
                (r.length == 1 ? '0' + r : r) +
                (g.length == 1 ? '0' + g : g) +
                (b.length == 1 ? '0' + b : b);
        }

        throw new Error(`invalid background color: '${bg}'`);
    }

    static async forUser(user: string): Promise<Contributions> {
        const dom = await JSDOM.fromURL(`https://github.com/users/${user}/contributions`);

        const { window } = dom;
        const document = window.document;
        const h2 = document.querySelector('h2');

        let count: number | undefined = undefined;

        if (h2) {
            const num = h2.innerHTML.match(/^\s*([\d,]+)\s+contributions/);

            if (num) {
                count = parseInt(num[1].replace(',', ''));
            }
        }

        const graph = document.querySelector('svg.js-calendar-graph-svg');

        if (graph == null) {
            throw new Error('no graph');
        }

        const intensity: { [key: string]: number } = { };
        const legend = document.querySelectorAll('ul.legend li');

        for (let i = 0; i < legend.length; i++) {
            const given = window.getComputedStyle(legend[i], null).getPropertyValue('background-color');
            const bg = Contributions.normalizeBackground(given);

            intensity[bg] = i;
        }

        const days = new Array();
        for (let block of document.querySelectorAll('svg.js-calendar-graph-svg rect.day')) {
            const date = block.getAttribute('data-date');
            const count = block.getAttribute('data-count');
            const color = block.getAttribute('fill');

            if (!date || !count || !count.match(/^\d+$/) || !color) {
                throw new Error('invalid svg');
            }

            const day = new ContributionDay(date, parseInt(count), color, intensity[color]);
            days.push(day);
        }

        return new Contributions(count, days);
    }
}
