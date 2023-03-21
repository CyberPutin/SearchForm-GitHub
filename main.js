let listRepo = []
const form = document.querySelector('.search-group');
const link = 'https://api.github.com/search/repositories?q=';

const createElem = (parent, elemName, txt, objProperties) => {
    const elem = document.createElement(elemName);
    if (txt == null) {
        elem.innerHTML = 'Ничего не найдено';
    } else {
        elem.innerHTML = txt;
    }
    if (objProperties) {
        Object.keys(objProperties).map(key => {
            elem.setAttribute(key, objProperties[key]);
        })
    }
    parent.append(elem);
    return elem;
}

const createRepo = (response) => {

    const card = 'repo-card';

    const wrp = document.querySelector('.repositories');
    const repo = createElem(wrp, 'div', '', { class: `${card}` });
    const title = createElem(repo, 'h3', response.name, { class: `${card}_title` }); 
    const avatar = createElem(repo, 'img', '', { class: `${card}_ava`, src: response.owner.avatar_url, alt: 'avatar' });
    const info = createElem(repo, 'div', '', { class: `${card}_info` });
    const username = createElem(info, 'div', '', { class: `${card}_info_grp ${card}_info_username` });
    const usernameTitle = createElem(username, 'span', 'Владелец: ', { class: `${card}_info_grp_title` });
    const usernameTxt = createElem(username, 'span', response.owner.login, { class: `${card}_info_username_txt` });
    const repoName = createElem(info, 'div', '', { class: `${card}_info_grp ${card}_info_link` });
    const repoNameTitle = createElem(repoName, 'span', 'Ссылка: ', { class: `${card}_info_grp_title` });
    const repoNameLink = createElem(repoName, 'a', response.name, { class: `${card}_info_link`, href: response.html_url, target: '_blank' });
    const langName = createElem(info, 'div', '', { class: `${card}_info_grp ${card}_info_lang` });
    const langNameTitle = createElem(langName, 'span', 'Язык: ', { class: `${card}_info_grp_title` });
    const langNameTxt = createElem(langName, 'span', response.language, { class: `${card}_info_lang_txt` });
    const description = createElem(info, 'div', '', { class: `${card}_info_grp ${card}_info_description` });
    const descriptionTitle = createElem(description, 'span', 'Описание: ', { class: `${card}_info_grp_title` });
    const descriptionTxt = createElem(description, 'span', response.description, { class: `${card}_info_description_txt` });

    wrp.append(repo);
}

form.onsubmit = async (event) => {
    event.preventDefault();

    const formTxt = document.querySelector('#search-field');
    const error = document.querySelector('.search-field_err');

    if (formTxt.value.length < 2) {
        const errorBody = document.querySelector('.search-field_err_attention');
        errorBody.innerHTML = 'Введите более двух символов'
        error.classList.add('search-field_err_visible');
        formTxt.classList.add('search-field_txt_err');
        throw 'Введены некорректные данные'
    }
    
    document.querySelector('.search_btn').disabled = 'true';

    const response = await fetch(link + formTxt.value);

    if (response.ok) {
        const wrp = document.querySelector('.repositories');
        const data = await response.json();
        wrp.innerHTML = '';

        if (data.items.length == 0) {
            localStorage.setItem('findRepo', JSON.stringify([]));
            const empty = createElem(wrp, 'p', 'Ничего не найдено', { class: `repositories_empty` });
        } else {
            localStorage.setItem('findRepo', JSON.stringify(data.items.slice(0, 12)));
            listRepo = [...JSON.parse(localStorage.getItem('findRepo'))];
            listRepo.map(item => {
                createRepo(item)
            })
        }
    } else {
        throw 'Ничего не найдено';
    }

    document.querySelector('.search_btn').removeAttribute('disabled');
}

document.querySelector('#search-field').oninput = () => {
    const inputElem = document.querySelector('#search-field');
    const blockWithError = document.querySelector('.search-field_err');
    if (blockWithError.classList.contains('search-field_err_visible')) {
        blockWithError.classList.remove('search-field_err_visible');
        inputElem.classList.remove('search-field_txt_err');
    }
}

const init = () => {
    
    const wrp = document.querySelector('.repositories');
    listRepo = JSON.parse(localStorage.getItem('findRepo'));
    if (listRepo && listRepo.length == 0) {
        const empty = createElem(wrp, 'p', 'Ничего не найдено', { class: `repositories_empty` });
    } else if (listRepo) {
        listRepo.map(item => {
            createRepo(item)
        })
    }
}
init();