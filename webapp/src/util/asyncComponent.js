import React from 'react'
export const asyncComponent = loadComponent => (
    class AsyncComponent extends React.Component {
        state = {
            loading: null,
        }
        Component=null
         componentWillMount () {
            this.setState({loading: false});

            loadComponent()
                .then(module => module.default)
                .then((Component) => {
                    this.Component=Component
                    this.setState({loading: true});
                })
                .catch((err) => {
                    console.error(`Cannot load component in <AsyncComponent />`);
                    throw err;
                });
        }


        render() {
            const { loading } = this.state;
            const Component=this.Component
            return (loading) ? <Component {...this.props} /> : null;
        }
    }
);