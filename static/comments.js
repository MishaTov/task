let socketIO = io()

const commentsDiv = document.querySelector('#comments-div')
const sendButton = document.querySelector('#comment-send')
const commentInputField = document.querySelector('#comment-input-field')
const url = document.querySelector('#task-info').getAttribute('description_url')
const uid = document.querySelector('#task-info').getAttribute('task_uid')

const commentElements = document.querySelectorAll('.comment-element')

commentsDiv.scrollTop = commentsDiv.scrollHeight

function sendComment() {
    if (!commentInputField.value.trim()) {
        commentInputField.value = ''
    } else {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({task_uid: uid, content: commentInputField.value})
        })
    }
}

function buildActionButton(){
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
    comment.content = comment.content.replaceAll('\n', '<br>')

    const newComment = document.createElement('div')
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
    newCommentContent.innerHTML = comment.content.trim()

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

function editComment(){
    const currentComment = this.parentNode.parentNode
    const commentUid = currentComment.getAttribute('comment_uid')
    commentInputField.value = currentComment.querySelector('.comment-content').innerHTML.replaceAll('<br>', '\n')
    commentInputField.focus()
}

function deleteComment(){
    const commentUid = this.parentNode.parentNode.getAttribute('comment_uid')
}

function setCommentListeners(comment){
    comment.onmouseover = showCommentActionButtons
    comment.onmouseout = hideCommentActionButtons
    comment.querySelector('#comment-edit').addEventListener('click', editComment)
    comment.querySelector('#comment-delete').addEventListener('click', deleteComment)
}

commentElements.forEach((comment) => {
    const actionButtons = comment.querySelector('.comment-edit-delete')
    if (comment.contains(actionButtons)){
        setCommentListeners(comment)
    }
})

commentInputField.onkeyup = (e) => {
    if (e.keyCode === 13) {
        if (!e.shiftKey) {
            commentInputField.value = commentInputField.value.trim()
            sendComment()
        }
    }
}

sendButton.addEventListener('click', sendComment)
socketIO.on('new comment', showNewComment)
