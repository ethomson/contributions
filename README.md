# GitHub Contributions

A TypeScript library for the [GitHub Contribution Graph](https://help.github.com/en/github/setting-up-and-managing-your-github-profile/viewing-contributions-on-your-profile).

## Usage

1. Get the contributions for a GitHub user, by name:

       const contributions = await Contributions.forUser('ethomson');

2. Get the days in the contribution graph:

       const days = contributions.getDays();

3. You can iterate and inspect the data in each day:

   1. Get the date, a string in `YYYY-MM-DD` format:

          day.getDate();

   2. Get the number of contributions on that day:

          day.getCount();

   3. Get the contribution intensity for the day, which is the number 0-4, where 0 indicates no contributions, and 4 is the most contributions.  This maps to the color used to indicate the contribution count for the graph.

          day.getIntensity();

   4. Get the color, a string in hexadecimal `#xxxxxx` format, that GitHub used for displaying this day in the contribution graph (this maps directly to the "intensity" level for the day:

## Example

Add the [`contributions`](http://npmjs.com/contributions) package (eg, `npm install contributions`).  Then:

```javascript
const { Contributions } = require('contributions')

const contributions = await Contributions.forUser('ethomson');
const days = contributions.getDays();

for (let day of days) {
    console.log(`${day.getDate()}: ${day.getIntensity()}`);
}
```

## License

contributions is released under the MIT license.

See the [license file](LICENSE.txt) for the full license text.
