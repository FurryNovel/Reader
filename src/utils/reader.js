import Shortcodes from '@tryghost/mg-shortcodes';

const shortcodes = new Shortcodes();


shortcodes.add('title', ({attrs, content}) => {
    return `<div class="font-bold text-2xl">${content}</div>`;
});
shortcodes.add('b', ({attrs, content}) => {
    return `<div class="font-bold">${content}</div>`;
});
shortcodes.add('img', ({attrs, content}) => {
    content = content.substring(5, content.length - 6);
    return `<img src="${content}"  alt=""/>`;
});
shortcodes.add('figcaption', ({attrs, content}) => {
    return `<div class="text-center text-sm">${content}</div>`;
});
shortcodes.add('hr', ({attrs, content}) => {
    return `<hr />`;
});

export function processContent(content = '测试文章', fontSize = 24) {
    let result = [];
    content = shortcodes.parse(content);
    content.split('\n').forEach((line) => {
        if (line.length > 0) {
            result.push(line);
        }
    });
    return result;
}

