function existingFieldsToString(params) {

    const values = Object.values(params).map((key) => key !== undefined ? key : false);
    const keys = Object.keys(params).map((key) => key !== undefined ? key : false);

    insert = keys.map((key, index) => `"${key}"=$${index+2}`);
    insert.toString();

    return {insert, values}
}

module.exports = {
    existingFieldsToString
}