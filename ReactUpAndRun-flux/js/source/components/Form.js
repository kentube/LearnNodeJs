import CRUDStore from '../flux/CRUDStore';
import FormInput from './FormInput';
import Rating from './Rating';
//import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Form extends Component {

    constructor(props) {
        super(props);
        this.fields = CRUDStore.getSchema();
        if ('recordId' in this.props) {
            this.initialData = CRUDStore.getRecord(this.props.recordId);
        }
    }
    
    getData() {
        let data = {};
        this.fields.forEach(field =>
            data[field.id] = this.refs[field.id].getValue()
        );
        return data;
    }

    render() {
        return (
            <form className="Form">{this.fields.map(field => 
            {
                const prefilled = this.initialData && this.initialData[field.id];
                if (!this.props.readonly) {
                    return (
                        <div className="FormRow" key={field.id}>
                            <label className="FormLabel" htmlFor={field.id}>{field.label}:</label>
                            <FormInput {...field} ref={field.id} defaultValue={prefilled} />
                        </div>
                    );
                }
                if (!prefilled) {
                    return null;
                }
                return (
                    <div className="FormRow" key={field.id}>
                        <span className="FormLabel">{field.label}:</span>
                        {
                            field.type === 'rating'
                                ? <Rating readonly={true} defaultValue={parseInt(prefilled, 10)} />
                                : <div>{prefilled}</div>
                        }
                    </div>
                );
            }, this)}
            </form>
        );
    }
}

Form.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    initialData: PropTypes.object,
    readonly: PropTypes.bool,
};

export default Form