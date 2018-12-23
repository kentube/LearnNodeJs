import Actions from './Actions';
import CRUDActions from '../flux/CRUDActions';
import CRUDStore from '../flux/CRUDStore';
import Dialog from './Dialog';
import Form from './Form';
import FormInput from './FormInput';
import Rating from './Rating';
//import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import invariant from 'invariant';

class Excel extends Component {
    constructor() {
        super();
        this.state = {
            data: CRUDStore.getData(),
            sortby: null, // schema.id
            descending: false,
            edit: null, // [row index, schema.id],
            dialog: null, // {type, idx}
        };
        this.schema = CRUDStore.getSchema();
        CRUDStore.addListener('change', () => {
          this.setState({
            data: CRUDStore.getData(),
          })
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.initialData });
    }
    _fireDataChange(data) {
        this.props.onDataChange(data);
    }

    _sort(key) {
        const descending = this.state.sortby === key && !this.state.descending;
        CRUDActions.sort(key, descending);
        this.setState({
          sortby: key,
          descending: descending,
        });
      }
    
    _showEditor(e) {
        this.setState({
            edit: {
                row: parseInt(e.target.dataset.row, 10),
                key: e.target.dataset.key,
            }
        });
    }

    _save(e) {
        e.preventDefault();
        invariant(this.state.edit, 'Messed up edit state');
        CRUDActions.updateField(
            this.state.edit.row,
            this.state.edit.key,
            this.refs.input.getValue()
        );
        this.setState({
            edit: null,
        });
    }
  
    _actionClick(rowidx, action) {
        this.setState({ dialog: { type: action, idx: rowidx } });
    }

    _deleteConfirmationClick(action) {
        this.setState({ dialog: null });
        if (action === 'dismiss') {
            return;
        }
        const index = this.state.dialog && this.state.dialog.idx;
        invariant(typeof index === 'number', 'Unexpected dialog state');
        CRUDActions.delete(index);
    } 

    _closeDialog() {
        this.setState({ dialog: null });
    }

    _saveDataDialog(action) {
        this.setState({ dialog: null });
        if (action === 'dismiss') {
            return;
        }
        const index = this.state.dialog && this.state.dialog.idx;
        invariant(typeof index === 'number', 'Unexpected dialog state');
        CRUDActions.updateRecord(index, this.refs.form.getData());
    }
    
    render() {
        return (
            <div className="Excel">
                {this._renderTable()}
                {this._renderDialog()}
            </div>
        );
    }
    _renderDialog() {
        if (!this.state.dialog) {
            return null;
        }
        switch (this.state.dialog.type) {
            case 'delete':
                return this._renderDeleteDialog();
            case 'info':
                return this._renderFormDialog(true);
            case 'edit':
                return this._renderFormDialog();
            default:
                throw Error(`Unexpected dialog type ${this.state.dialog.type}`);
        }
    }
    _renderDeleteDialog() {
        const first = this.state.data[this.state.dialog.idx];
        const nameguess = first[Object.keys(first)[0]];
        return (
            <Dialog
                modal={true}
                header="Confirm deletion"
                confirmLabel="Delete"
                onAction={this._deleteConfirmationClick.bind(this)}
            >
                {`Are you sure you want to delete "${nameguess}"?`}
            </Dialog>
        );
    }

    _renderFormDialog(readonly) {
        const index = this.state.dialog && this.state.dialog.idx;
        invariant(typeof index === 'number', 'Unexpected dialog state');
        return (
            <Dialog
                modal={true}
                header={readonly ? 'Item info' : 'Edit item'}
                confirmLabel={readonly ? 'ok' : 'Save'}
                hasCancel={!readonly}
                onAction={this._saveDataDialog.bind(this)}
            >
                <Form
                    ref="form"
                    recordId={index}
                    readonly={!!readonly} />
            </Dialog>
        );
    }
    
    _renderTable() {
        return (
            <table>
                <thead>
                    <tr>{
                        this.schema.map(item => {
                            if (!item.show) {
                                return null;
                            }
                            let title = item.label;
                            if (this.state.sortby === item.id) {
                                title += this.state.descending ? ' \u2191' : ' \u2193';
                            }
                            return (
                                <th
                                    className={`schema-${item.id}`}
                                    key={item.id}
                                    onClick={this._sort.bind(this, item.id)}
                                >
                                    {title}
                                </th>
                            );
                        }, this)
                    }
                        <th className="ExcelNotSortable">Actions</th>
                    </tr>
                </thead>
                <tbody onDoubleClick={this._showEditor.bind(this)}>
                    {this.state.data.map((row, rowidx) => {
                        return (
                            <tr key={rowidx}>{
                                Object.keys(row).map((cell, idx) => {
                                    const schema = this.schema[idx];
                                    if (!schema || !schema.show) {
                                        return null;
                                    }
                                    const isRating = schema.type === 'rating';
                                    const edit = this.state.edit;
                                    let content = row[cell];
                                    if (!isRating && edit && edit.row === rowidx && edit.key ===
                                        schema.id) {
                                        content = (
                                            <form onSubmit={this._save.bind(this)}>
                                                <FormInput ref="input" {...schema} defaultValue={content} />
                                            </form>
                                        );
                                    } else if (isRating) {
                                        content = <Rating readonly={true} defaultValue={Number(content)
                                        } />;
                                    }
                                    return (
                                        <td
                                            className={classNames({
                                                [`schema-${schema.id}`]: true,
                                                'ExcelEditable': !isRating,
                                                'ExcelDataLeft': schema.align === 'left',
                                                'ExcelDataRight': schema.align === 'right',
                                                'ExcelDataCenter': schema.align !== 'left' &&
                                                    schema.align !== 'right',
                                            })}
                                            key={idx}
                                            data-row={rowidx}
                                            data-key={schema.id}>
                                            {content}
                                        </td>
                                    );
                                }, this)}
                                <td className="ExcelDataCenter">
                                    <Actions onAction={this._actionClick.bind(this, rowidx)} />
                                </td>
                            </tr>
                        );
                    }, this)}
                </tbody>
            </table>
        );
    }
}

Excel.propTypes = {
    schema: PropTypes.arrayOf(
        PropTypes.object
    ),
    initialData: PropTypes.arrayOf(
        PropTypes.object
    ),
    onDataChange: PropTypes.func,
};

export default Excel