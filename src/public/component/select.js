function Select(id, options) {
    if ( id instanceof String )
        throw new Error('param must String');

    var defaultOptions = {
        async: false,
        data: [],
        defaultEmpty: false,
        defaultValueIndex: 0,
        allowInput: true,
        ajaxOptions: {
            url: '',
            data: {},
            resDataCleared: null
        }
    }

    this.options = _.assign(defaultOptions, options);
    this.selectNode = document.getElementById(id);
    this._init_();
}

Select.prototype._init_ = function() {
    var target = this.selectNode;
    this.createBaseFrame();
}

Select.prototype.createBaseFrame = function() {
    var outBox = document.createElement('div');
    var icon = document.createElement('i');
    var resultBox = document.createElement('div');
    var inputBox = document.createElement('input');
    var scrollBox = document.createElement('ul');

    outBox.setAttribute('class', 'cmp__select');
    icon.setAttribute('class', 'select__icon');
    inputBox.setAttribute('class', 'select__input');
    inputBox.setAttribute('type', 'text');
    resultBox.setAttribute('class', 'select__result');
    scrollBox.setAttribute('class', 'select__scroll');   

    resultBox.appendChild(inputBox);
    resultBox.appendChild(scrollBox);
    outBox.appendChild(resultBox);
    outBox.appendChild(icon);

    this.selectNode.appendChild(outBox);
}