let socketIO = io()

const commentsDiv = document.querySelector('#comments-div')
const sendButton = document.querySelector('#comment-send')
const commentInputField = document.querySelector('#comment-input-field')
const commentElements = document.querySelectorAll('.comment-element')

const url = document.querySelector('#task-info').getAttribute('description_url')
const currentTaskUid = document.querySelector('#task-info').getAttribute('task_uid')

let editMode = false
let activeCommentUid

commentsDiv.scrollTop = commentsDiv.scrollHeight


function buildActionButton() {
    const actionButton = document.createElement('button')
    actionButton.style.backgroundColor = 'inherit'
    actionButton.style.border = 'none'
    actionButton.style.height = '12px'
    actionButton.style.width = '12px'
    actionButton.style.padding = '0'
    actionButton.style.fontSize = '12px'
    actionButton.style.display = 'flex'
    actionButton.style.justifyContent = 'center'
    actionButton.style.alignItems = 'center'
    return actionButton
}


function showNewComment(comment) {
    commentInputField.value = ''
    comment.content = comment.content
        .replaceAll('\n', '<br>')
        .replaceAll(' ', '&nbsp;')

    const newComment = document.createElement('div')
    newComment.classList.add('comment-element')
    newComment.style.position = 'relative'
    newComment.style.padding = '0px 3px 0px 3px'
    newComment.style.marginBottom = '10px'

    const newCommentAuthor = document.createElement('div')
    newCommentAuthor.style.marginLeft = '5px'
    newCommentAuthor.style.fontSize = '12px'

    const authorLink = document.createElement('a')
    authorLink.classList.add('link-opacity-75-hover')
    authorLink.classList.add('link-underline')
    authorLink.classList.add('link-underline-opacity-0')
    authorLink.href = '/profile/' + comment.author
    authorLink.innerHTML = comment.author

    const newCommentContentElement = document.createElement('div')
    newCommentContentElement.style.wordBreak = 'break-all'
    newCommentContentElement.style.border = '1px solid rgba(0, 0, 0, 0.5)'
    newCommentContentElement.style.borderRadius = '5px'
    newCommentContentElement.style.backgroundColor = 'rgba(0,15,135,0.1)'
    newCommentContentElement.style.padding = '2px 5px 0px 2px'
    newCommentContentElement.style.fontSize = '12px'

    const newCommentContent = document.createElement('span')
    newCommentContent.classList.add('comment-content')
    newCommentContent.innerHTML = comment.content.replaceAll(' ', '&nbsp;')

    const newCommentDate = document.createElement('div')
    newCommentDate.style.textAlign = 'right'
    newCommentDate.style.marginTop = '2px'
    newCommentDate.style.fontSize = '10px'
    newCommentDate.innerHTML = comment.created

    const actionButtons = document.createElement('span')
    actionButtons.classList.add('comment-edit-delete')
    actionButtons.style.position = 'absolute'
    actionButtons.style.right = '5px'
    actionButtons.style.top = '5px'
    actionButtons.style.height = '12px'
    actionButtons.style.width = '26px'
    actionButtons.style.fontSize = '12px'
    actionButtons.style.display = 'none'
    actionButtons.style.justifyContent = 'space-between'
    actionButtons.style.alignItems = 'center'
    actionButtons.style.zIndex = '10'

    const editCommentImg = document.createElement('img')
    editCommentImg.src = '/static/img/edit_msg.png'
    editCommentImg.alt = 'Edit comment'
    editCommentImg.style.height = '12px'
    editCommentImg.style.width = '12px'

    const deleteCommentImg = document.createElement('img')
    deleteCommentImg.src = '/static/img/delete_msg.png'
    deleteCommentImg.alt = 'Delete comment'
    deleteCommentImg.style.height = '12px'
    deleteCommentImg.style.width = '12px'

    const editCommentButton = buildActionButton()
    editCommentButton.setAttribute('id', 'comment-edit')
    editCommentButton.appendChild(editCommentImg)

    const deleteCommentButton = buildActionButton()
    deleteCommentButton.setAttribute('id', 'comment-delete')
    deleteCommentButton.appendChild(deleteCommentImg)

    actionButtons.appendChild(editCommentButton)
    actionButtons.appendChild(deleteCommentButton)

    newCommentContentElement.appendChild(newCommentContent)


    newCommentContentElement.appendChild(newCommentDate)

    newCommentAuthor.appendChild(authorLink)

    newComment.appendChild(actionButtons)
    newComment.appendChild(newCommentAuthor)
    newComment.appendChild(newCommentContentElement)

    setCommentListeners(newComment)

    commentsDiv.appendChild(newComment)

    commentsDiv.scrollTop = commentsDiv.scrollHeight
}

function showCommentActionButtons() {
    this.querySelector('.comment-edit-delete').style.display = 'flex'
}

function hideCommentActionButtons() {
    this.querySelector('.comment-edit-delete').style.display = 'none'
}

function sendComment() {
    if (!commentInputField.value.trim()) {
        commentInputField.value = ''
    } else {
        let requestMethod, requestBody
        if (editMode) {
            requestMethod = 'PATCH'
            requestBody = JSON.stringify({
                type: 'comment',
                comment_uid: activeCommentUid,
                content: commentInputField.value
            })
        } else {
            requestMethod = 'POST'
            requestBody = JSON.stringify({
                type: 'comment',
                task_uid: currentTaskUid,
                content: commentInputField.value
            })
        }
        fetch(url, {
            method: requestMethod,
            headers: {
                'Content-type': 'application/json'
            },
            body: requestBody
        })
        // console.log(requestMethod)
        // console.log(requestBody)
    }
}

function editComment() {
    editMode = true
    const currentComment = this.closest('.comment-element')
    activeCommentUid = currentComment.getAttribute('comment_uid')
    commentInputField.value = currentComment.querySelector('.comment-content').innerHTML
        .replaceAll('<br>', '\n')
        .replaceAll('&nbsp;', ' ')
    commentInputField.focus()
}

function deleteComment() {
    const commentUid = this.parentNode.parentNode.getAttribute('comment_uid')
}

function setCommentListeners(comment) {
    comment.onmouseover = showCommentActionButtons
    comment.onmouseout = hideCommentActionButtons
    comment.querySelector('#comment-edit').addEventListener('click', editComment)
    comment.querySelector('#comment-delete').addEventListener('click', deleteComment)
}

commentElements.forEach((comment) => {
    const actionButtons = comment.querySelector('.comment-edit-delete')
    if (comment.contains(actionButtons)) {
        setCommentListeners(comment)
    }
})

commentInputField.onkeyup = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        commentInputField.value = commentInputField.value.trim()
        sendComment()
        editMode = false
    } else if (e.key === 'Escape') {
        commentInputField.value = ''
        commentInputField.blur()
        editMode = false
    }
}

sendButton.addEventListener('click', sendComment)
socketIO.on('new comment', showNewComment)
