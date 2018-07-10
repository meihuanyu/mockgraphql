import React from 'react'
import Com404 from '../common/404Com' 
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
                    console.log(`Cannot load component in <AsyncComponent />`);
                    this.Component=Com404
                    this.setState({loading: true});
                });
        }


        render() {
            const { loading } = this.state;
            const Component=this.Component
            return (loading) ? <Component {...this.props} /> : null;
        }
    }
);