import alter from '../lib/alter.js';
import _ from 'lodash';
import Chainable from '../lib/classes/chainable';

const positions = ['left', 'right', 'center'];
const defaultPosition = positions[0];

export default new Chainable('movingstd', {
  args: [
    {
      name: 'inputSeries',
      types: ['seriesList']
    },
    {
      name: 'window',
      types: ['number'],
      help: 'Number of points to compute the standard deviation over.'
    },
    {
      name: 'position',
      types: ['string', 'null'],
      help: `Position of the window slice relative to the result time. Options are ${positions.join(', ')}. Default: ${defaultPosition}`
    }
  ],
  aliases: ['mvstd'],
  help: 'Calculate the moving standard deviation over a given window. Uses naive two-pass algorithm. Rounding errors ' +
    'may become more noticeable with very long series, or series with very large numbers.',
  fn: function movingstdFn(args) {
    return alter(args, function (eachSeries, _window, _position) {

      _position = _position || defaultPosition;

      if (!_.contains(positions, _position)) throw new Error('Valid positions are: ' + positions.join(', '));

      const pairs = eachSeries.data;
      const pairsLen = pairs.length;
      eachSeries.label = eachSeries.label + ' mvstd=' + _window;

      function toPoint(point, pairSlice) {
        const average = _.chain(pairSlice).map(1).reduce(function (memo, num) {
          return memo + num;
        }).value() / _window;

        const variance = _.chain(pairSlice).map(function (point) {
          return Math.pow(point[1] - average, 2);
        }).reduce(function (memo, num) {
          return memo + num;
        }).value() / (_window - 1);

        return [point[0], Math.sqrt(variance)];
      }

      if (_position === 'center') {
        const windowLeft = Math.floor(_window / 2);
        const windowRight = _window - windowLeft;
        eachSeries.data = _.map(pairs, function (point, i) {
          if (i < windowLeft || i >= pairsLen - windowRight) return [point[0], null];
          return toPoint(point, pairs.slice(i - windowLeft, i + windowRight));
        });
      } else if (_position === 'left') {
        eachSeries.data = _.map(pairs, function (point, i) {
          if (i < _window) return [point[0], null];
          return toPoint(point, pairs.slice(i - _window, i));
        });
      } else if (_position === 'right') {
        eachSeries.data = _.map(pairs, function (point, i) {
          if (i >= pairsLen - _window) return [point[0], null];
          return toPoint(point, pairs.slice(i, i + _window));
        });
      }

      return eachSeries;
    });
  }
});
