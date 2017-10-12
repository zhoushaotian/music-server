import ReactDOM from 'react-dom';
import appRouter from './router.jsx';
import '../../node_modules/antd/dist/antd.less';

ReactDOM.render(
    appRouter,
    document.getElementById('app')
);