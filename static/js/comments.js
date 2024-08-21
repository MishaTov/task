import {socketio} from "./socket.js";

const commentsList = document.querySelector('#comments-list');
const sendCommentButton = document.querySelector('#comment-send');
const commentInputField = document.querySelector('#comment-input-field');
const commentElements = document.querySelectorAll('.comment');

const url = document.querySelector('#task-info').getAttribute('description_url');
const currentTaskUid = document.querySelector('#task-info').getAttribute('task_uid');

let editMode = false;
let activeCommentUid;

commentsList.scrollTop = commentsList.scrollHeight;


function buildActionButton() {
    const actionButton = document.createElement('button');
    actionButton.classList.add('comment-action-button')
    return actionButton;
}


function showNewComment(comment) {
    comment.content = comment.content
        .replaceAll('\n', '<br>')
        .replaceAll(' ', '&nbsp;');

    const newComment = document.createElement('div');
    newComment.classList.add('comment');
    newComment.setAttribute('id', `comment-${comment.comment_uid}`);

    const newCommentAuthor = document.createElement('div');
    newCommentAuthor.classList.add('comment-author')

    const authorLink = document.createElement('a');
    authorLink.classList.add('link-opacity-75-hover');
    authorLink.classList.add('link-underline');
    authorLink.classList.add('link-underline-opacity-0');
    authorLink.href = '/profile/' + comment.author;
    authorLink.innerHTML = comment.author;

    const newCommentContentElement = document.createElement('div');
    newCommentContentElement.classList.add('comment-content-element')

    const newCommentContent = document.createElement('span');
    newCommentContent.classList.add('comment-content');
    newCommentContent.innerHTML = comment.content.replaceAll(' ', '&nbsp;');

    const newCommentDate = document.createElement('div');
    newCommentDate.classList.add('comment-created')
    newCommentDate.innerHTML = comment.created;

    const actionButtons = document.createElement('span');
    actionButtons.classList.add('comment-buttons');

    const editCommentImg = document.createElement('img');
    editCommentImg.src = '/static/img/edit_msg.png';
    editCommentImg.alt = 'Edit comment';
    editCommentImg.classList.add('comment-action-img')

    const deleteCommentImg = document.createElement('img');
    deleteCommentImg.src = '/static/img/delete_msg.png';
    deleteCommentImg.alt = 'Delete comment';
    deleteCommentImg.classList.add('comment-action-img')

    const editCommentButton = buildActionButton();
    editCommentButton.setAttribute('id', 'comment-edit');
    editCommentButton.appendChild(editCommentImg);

    const deleteCommentButton = buildActionButton();
    deleteCommentButton.setAttribute('id', 'comment-delete');
    deleteCommentButton.appendChild(deleteCommentImg);

    actionButtons.appendChild(editCommentButton);
    actionButtons.appendChild(deleteCommentButton);

    newCommentContentElement.appendChild(newCommentContent);


    newCommentContentElement.appendChild(newCommentDate);

    newCommentAuthor.appendChild(authorLink);

    newComment.appendChild(actionButtons);
    newComment.appendChild(newCommentAuthor);
    newComment.appendChild(newCommentContentElement);

    setCommentListeners(newComment);

    commentsList.appendChild(newComment);

    commentsList.scrollTop = commentsList.scrollHeight;
}

function updateComment(comment) {
    const commentElement = document.querySelector(`#comment-${comment.comment_uid}`);
    commentElement.querySelector('.comment-content').innerHTML = comment.content
        .replaceAll('\n', '<br>')
        .replaceAll(' ', '&nbsp;');
}

function showCommentActionButtons() {
    this.querySelector('.comment-buttons').style.display = 'flex';
}

function hideCommentActionButtons() {
    this.querySelector('.comment-buttons').style.display = 'none';
}

function sendComment() {
    commentInputField.value = commentInputField.value.trim();
    if (!commentInputField.value.trim()) {
        commentInputField.value = '';
    } else {
        let requestMethod, requestBody;
        if (editMode) {
            requestMethod = 'PATCH';
            requestBody = JSON.stringify({
                type: 'comment',
                comment_uid: activeCommentUid,
                content: commentInputField.value
            });
        } else {
            requestMethod = 'POST';
            requestBody = JSON.stringify({
                type: 'comment',
                task_uid: currentTaskUid,
                content: commentInputField.value
            });
        }
        fetch(url, {
            method: requestMethod,
            headers: {
                'Content-type': 'application/json'
            },
            body: requestBody
        });
    }
    commentInputField.value = '';
    editMode = false;
}

function editComment() {
    editMode = true;
    const currentComment = this.closest('.comment');
    activeCommentUid = currentComment.getAttribute('id').replaceAll('comment-', '');
    commentInputField.value = currentComment.querySelector('.comment-content').innerHTML
        .replaceAll('<br>', '\n')
        .replaceAll('&nbsp;', ' ');
    commentInputField.focus();
}

function deleteComment() {
    const currentComment = this.closest('.comment');
    activeCommentUid = currentComment.getAttribute('id').replaceAll('comment-', '');
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            type: 'comment',
            comment_uid: activeCommentUid
        })
    });
}

function removeComment(comment) {
    editMode = false;
    const currentComment = document.querySelector(`#comment-${comment.comment_uid}`);
    currentComment.remove();
}

function setCommentListeners(comment) {
    comment.onmouseover = showCommentActionButtons;
    comment.onmouseout = hideCommentActionButtons;
    comment.querySelector('#comment-edit').addEventListener('click', editComment);
    comment.querySelector('#comment-delete').addEventListener('click', deleteComment);
}

commentElements.forEach((comment) => {
    const actionButtons = comment.querySelector('.comment-buttons');
    if (comment.contains(actionButtons)) {
        setCommentListeners(comment);
    }
})

commentInputField.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendComment();
    } else if (e.key === 'Escape') {
        commentInputField.value = '';
        commentInputField.blur();
        editMode = false;
    }
}

sendCommentButton.addEventListener('click', sendComment);
socketio.on('new comment', showNewComment);
socketio.on('update comment', updateComment);
socketio.on('delete comment', removeComment);
