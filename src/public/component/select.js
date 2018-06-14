function Select(id, options) {
    if ( id instanceof String )
        throw new Error('param must String');

    this.options = {
        async: false,
        data: [],
        ajaxOptions: {
            url: '',
            data: {},
            resDataCleared: null
        }
    }
    this.selectNode = document.getElementById(id);
}