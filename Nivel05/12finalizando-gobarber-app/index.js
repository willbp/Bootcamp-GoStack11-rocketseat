/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App'; //para inicializar o app nesta pasta/página
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
