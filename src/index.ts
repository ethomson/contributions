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
    private static colors: string[] = [
        '#ebedf0',
        '#9be9a8',
        '#40c463',
        '#30a14e',
        '#216e39'
    ];

    private constructor(count: number | undefined, days: ContributionDay[]) {
        this.count = count;
        this.days = days;
    }

    getDays(): ContributionDay[] {
        return this.days.slice(0);
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

        const graph = document.querySelector('div.js-calendar-graph');

        if (graph == null) {
            throw new Error('no graph');
        }

        const days = new Array();
        for (let block of document.querySelectorAll('div.js-calendar-graph td.ContributionCalendar-day')) {
            const id = block.getAttribute('id');
            const date = block.getAttribute('data-date');
            const level = block.getAttribute('data-level');

            let contributions = null;

            for (let tooltip of document.querySelectorAll('div.js-calendar-graph tool-tip')) {
              if (tooltip.getAttribute('for') === id) {
                contributions = tooltip.innerHTML.match(/^(\d+|No) /);
              }
            }

            if (!date || !level || !level.match(/^\d+$/)) {
                throw new Error('invalid svg');
            }

            if (!contributions || !contributions[1]) {
                throw new Error('invalid svg');
            }

            const count = (contributions[1] === "No") ? "0" : contributions[1];

            const intensity = parseInt(level);
            const day = new ContributionDay(date, parseInt(count), this.colors[intensity], intensity);
            days.push(day);
        }

        return new Contributions(count, days);
    }
}
