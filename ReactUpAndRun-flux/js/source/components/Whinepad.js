import Button from './Button'; // <- for the "add new item"
import Dialog from './Dialog'; // <- to pop the "add new item" form
import Excel from './Excel'; // <- the table of all items
import Form from './Form'; // <- the "add new item" form
//import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CRUDActions from '../flux/CRUDActions';
import CRUDStore from '../flux/CRUDStore';

class Whinepad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addnew: false,
            count: CRUDStore.getCount(),
        };
        this._preSearchData = null;

        CRUDStore.addListener('change', () => {
            this.setState({
                count: CRUDStore.getCount(),
            })
        });      
    }

    shouldComponentUpdate(newProps, newState) {
        return newState.addnew !== this.state.addnew
            || newState.count !== this.state.count;
    }
    
    _addNewDialog() {
        this.setState({ addnew: true });
    }
    _addNew(action) {
        this.setState({ addnew: false });
        if (action === 'confirm') {
            CRUDActions.create(this.refs.form.getData());
        }
    }
    _onExcelDataChange(data) {
        this.setState({ data: data });
        this._commitToStorage(data);
    }
    _commitToStorage(data) {
        localStorage.setItem('data', JSON.stringify(data));
    }
    _startSearching() {
        this._preSearchData = this.state.data;
    }
    _doneSearching() {
        this.setState({
            data: this._preSearchData,
        });
    }
    _search(e) {
        const needle = e.target.value.toLowerCase();
        if (!needle) {
            this.setState({ data: this._preSearchData });
            return;
        }
        const fields = this.props.schema.map(item => item.id);
        const searchdata = this._preSearchData.filter(row => {
            for (let f = 0; f < fields.length; f++) {
                if (row[fields[f]].toString().toLowerCase().indexOf(needle) > -1) {
                    return true;
                }
            }
            return false;
        });
        this.setState({ data: searchdata });
    }
    render() {
        return (
            <div className="Whinepad">
                <div className="WhinepadToolbar">
                    <div className="WhinepadToolbarAdd">
                        <Button
                            onClick={this._addNewDialog.bind(this)}
                            className="WhinepadToolbarAddButton">
                            + add
                        </Button>
                    </div>
                    <div className="WhinepadToolbarSearch">
                        <input
              placeholder={this.state.count === 1
                ? 'Search 1 record...'
                : `Search ${this.state.count} records...`
              }
              onChange={CRUDActions.search.bind(CRUDActions)}
              onFocus={CRUDActions.startSearching.bind(CRUDActions)} 
                        />

                    </div>
                </div>
                <div className="WhinepadDatagrid">
                    <Excel />
                </div>
                {this.state.addnew
                    ? <Dialog
                        modal={true}
                        header="Add new item"
                        confirmLabel="Add"
                        onAction={this._addNew.bind(this)}
                    >
                        <Form
                            ref="form"
                            fields={this.props.schema} />
                    </Dialog>
                    : null}
            </div>
        );
    }
}

Whinepad.propTypes = {
    schema: PropTypes.arrayOf(
        PropTypes.object
    ),
    initialData: PropTypes.arrayOf(
        PropTypes.object
    ),
};
export default Whinepad;

