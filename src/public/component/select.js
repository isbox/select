/**
 * 面试用，不提供注释
*/

function Select(id, options) {
    if ( id instanceof String )
        throw new Error('param must String');

    var defaultOptions = {
        async: false,
        data: [],
        // defaultEmpty: false,
        defaultValueIndex: 0,
        allowInput: true,
        ajaxOptions: {
            url: '',
            data: {},
            resDataCleared: null
        }
        // placeholder: ''
    };

    this.options = _.assign({}, defaultOptions, options);
    this.searchResult = [];
    this.result = {};
    this.selectNode = document.getElementById(id);

    if ( this.selectNode ) {
        this._init_();
    } else {
        throw new Error('no target');
    }
}

Select.prototype._init_ = function() {
    var target = this.selectNode;
    var self = this;
    
    this.createBaseFrame();
    if ( this.options.async ) {
        this.getAsyncData();
    }
    
    this.fill();
}

Select.prototype.getResult = function() {
    return this.result;
}

Select.prototype.getAsyncData = function() {
    var self = this;
    var http = new XMLHttpRequest();
    var ajaxOptions = this.options.ajaxOptions;
    var dataStr = '?';
    for (var key in ajaxOptions.data) {
        dataStr += (key + '=' + ajaxOptions.data[key] + '&');
    }
    dataStr = dataStr.substring(0, dataStr.length - 1);
    
    http.onreadystatechange= function(event) {
        let target = event.target;
        if ( target.readyState === 4 && target.status === 200 ) {
            var res = JSON.parse(http.responseText);
            self.options.data = res.value;
            self.fill();
        }
    }

    http.open('GET', ajaxOptions.url + dataStr);
    http.send();
}

Select.prototype.search = function(e) {
    var self = this;
    return function(e) {
        var data = self.options.data;
        clearTimeout(self.searchTimer);
        self.searchTimer = setTimeout(function() {
            self.searchResult = [];
            var searchTxt = e.target.value.trim();
            var reg = new RegExp('^' + searchTxt);
            
            for ( var i = 0; i < data.length; i++ ) {
                (function() {
                    if ( reg.test(data[i].text) ) {
                        var newData = data[i];
                        newData.frontText = searchTxt;
                        newData.backText = data[i].text.replace(searchTxt, '');
                        self.searchResult.push(newData);
                    }
                })(i)
            }
    
            self.fill(true);
        }, 500)
    }
}

Select.prototype.choose = function(e) {
    var self = this;
    return function(e) {
        if ( e.button === 0 ) {
            var index = e.target.dataset.index;
            var id = e.target.dataset.id;
    
            if ( id && /select__item/.test(e.target.className) ) {
                if ( String(self.result.id) !== String(id) ) {
                    var data = _.isEmpty(self.searchResult) ? self.options.data : self.searchResult;
                    self.result = data[index];
                    self.selecInputNode.value = self.result.text;
                    self.searchInputNode.value = '';
                    self.searchResult = [];
                    self.fill();
                    alert('你选择的是：' + self.result.text + '，id值为：' + self.result.id);
                }
            }
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
    inputBox.setAttribute('placeholder', '搜索');
    inputBox.addEventListener('input', this.search.call(this), false);

    resultBox.setAttribute('class', 'select__result');
    scrollBox.setAttribute('class', 'select__scroll');  
    scrollBox.addEventListener('mousedown', this.choose.call(this), false);

    if ( this.options.async && !this.options.data.length ) {
        selectInput.setAttribute('placeholder', '数据获取中...');
    } 

    resultBox.appendChild(scrollBox);
    outBox.appendChild(selectInput);
    outBox.appendChild(inputBox);
    outBox.appendChild(resultBox);
    outBox.appendChild(icon);

    this.selectNode.appendChild(outBox);
}

Select.prototype.fill = function(search) {
    var data = search ? this.searchResult : this.options.data;
    var isSearch = search;
    var _list = [];

    for ( var i = 0; i < data.length; i++ ) {
        (function() {
            if ( !isSearch ) {
                // data-id="' + data[i].id + '" data-index="' + i + '"
                _list.push(
                    '<li class="select__item" data-id="' + data[i].id + '" data-index="' + i + '">' + data[i].text + '</li>'                
                )
            } else {
                _list.push(
                    '<li class="select__item" data-id="' + data[i].id + '" data-index="' + i + '"><span class="select__search__result">' + data[i].frontText + '</span>' + data[i].backText + '</li>'                
                )
            }
        })(i)
    }

    if ( _.isEmpty(this.result) ) {
        this.result = _.isEmpty(data) ? {} : this.options.data[this.options.defaultValueIndex]
        this.selecInputNode.value = _.isEmpty(data) ? '' : this.result.text;
    }
    this.scrollNode.innerHTML = _list.join('');
}