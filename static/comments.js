let socketIO = io()

const commentsDiv = document.querySelector('#comments-div')
const sendButton = document.querySelector('#comment-send')
const commentContent = document.querySelector('#comment-content')
const url = document.querySelector('#task-info').getAttribute('description_url')
const uid = document.querySelector('#task-info').getAttribute('task_uid')

commentsDiv.scrollTop = commentsDiv.scrollHeight

function sendComment() {
    if (!commentContent.value.trim()) {
        commentContent.value = ''
    } else {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({task_uid: uid, content: commentContent.value})
        })
    }
}


function showNewComment(comment) {
    commentContent.value = ''
    comment.content = comment.content.replaceAll('\n', '<br>')

    const newComment = document.createElement('div')
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

    const newCommentContent = document.createElement('div')
    newCommentContent.style.wordBreak = 'break-all'
    newCommentContent.style.border = '1px solid rgba(0, 0, 0, 0.5)'
    newCommentContent.style.borderRadius = '5px'
    newCommentContent.style.backgroundColor = 'rgba(0,15,135,0.1)'
    newCommentContent.style.padding = '2px 5px 0px 2px'
    newCommentContent.style.fontSize = '12px'
    newCommentContent.innerHTML = comment.content

    const newCommentDate = document.createElement('div')
    newCommentDate.style.textAlign = 'right'
    newCommentDate.style.marginTop = '2px'
    newCommentDate.style.fontSize = '10px'
    newCommentDate.innerHTML = comment.created

    newCommentContent.appendChild(newCommentDate)

    newCommentAuthor.appendChild(authorLink)

    newComment.appendChild(newCommentAuthor)
    newComment.appendChild(newCommentContent)

    commentsDiv.appendChild(newComment)

    commentsDiv.scrollTop = commentsDiv.scrollHeight
}


commentContent.onkeyup = (e) => {
    //e = e || event
    if (e.keyCode === 13) {
        if (!e.shiftKey) {
            sendComment()
            e.preventDefault()
        }
    }
    return true
}


sendButton.addEventListener('click', sendComment)
socketIO.on('new comment', showNewComment)
