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
        },
        placeholder: ''
    };
    var self = this;

    this.options = _.assign({}, defaultOptions, options);
    this.selectNode = document.getElementById(id);
    this._init_();
}

Select.prototype._init_ = function() {
    var target = this.selectNode;
    var self = this;
    
    this.createBaseFrame();
    this.fill();
}

Select.prototype.choose = function(e) {
    if ( e.button === 0 ) {
        let id = e.target.dataset.id;
        if ( id && e.target.className.includes('select__item') ) {
            console.log(id)
        }
    }
}

Select.prototype.createBaseFrame = function() {
    var outBox = document.createElement('div');
    var selectInput = document.createElement('input');
    var icon = document.createElement('i');
    var resultBox = document.createElement('div');
    var inputBox = document.createElement('input');
    var scrollBox = document.createElement('ul');

    this.selecInputNode = selectInput;
    this.searchInputNode = inputBox;
    this.scrollNode = scrollBox;

    outBox.setAttribute('class', 'cmp__select');
    icon.setAttribute('class', 'select__icon');
    selectInput.setAttribute('class', 'select__input');
    selectInput.setAttribute('readonly', 'readonly');
    inputBox.setAttribute('class', 'search__input');
    inputBox.setAttribute('type', 'text');
    resultBox.setAttribute('class', 'select__result');
    scrollBox.setAttribute('class', 'select__scroll');  


    scrollBox.addEventListener('mousedown', this.choose, false);
    scrollBox.addEventListener('mouseenter', function() {
        var classname = outBox.className;
        if ( !/stay/.test(classname) ) {
            outBox.className += ' stay';
        }
    }, false);
    scrollBox.addEventListener('mouseleave', function() {
        var classname = outBox.className;
        outBox.className = classname.replace(/ stay/, '');
    }, false);

    resultBox.appendChild(scrollBox);
    outBox.appendChild(selectInput);
    outBox.appendChild(inputBox);
    outBox.appendChild(resultBox);
    outBox.appendChild(icon);

    this.selectNode.appendChild(outBox);
}

Select.prototype.fill = function() {
    var data = this.options.data;
    console.log(this.options);
    var _list = [];
    for ( var i = 0; i < data.length; i++ ) {
        (function() {
            _list.push(
                '<li class="select__item" data-id="' + data[i].id + '">' + data[i].text + '</li>'                
            )
        })(i)
    }
    this.scrollNode.innerHTML = _list.join('');
}