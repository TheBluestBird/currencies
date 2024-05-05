// import React from "react";
// import ReactDOM from 'react-dom/client';
// import App from '../../src/App';
//
// const rootMock = {
//     render: jest.fn(),
// };
//
// jest.mock('react-dom/client', () => ({
//     createRoot: jest.fn(() => rootMock),
// }));
//
// describe('Root DOM', () => {
//     test('renders App', () => {
//         const root = document.createElement('div');
//         root.id = 'root';
//         document.body.append(root);
//
//         import('../../src/index');
//
//         expect(ReactDOM.createRoot).toHaveBeenCalledWith(root);
//         expect(rootMock.render).toHaveBeenCalledWith(<App />);
//     });
// });