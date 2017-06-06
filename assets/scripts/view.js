'use strict'

const store = require('./store')
const dt = require('datatables.net')

//
// VIEW INITIALIZERS
//

// initView()
// initializes view containers and event handlers

const initView = () => {
  // render private view to navbar-div
  renderView('.navbar-div', 'nav-public')
  // user sign up / sign in forms
  renderView('.content-div', 'form-auth')
  // add event handlers for view contoller elements
  addHandlers()
}

//
// VIEW RENDERING FUNCTIONS
//

// renderView(element, hbsFile, params)
// renders the template and replaces the element

const renderView = (element, hbsFile, params) => {
  const template = require(`./templates/${hbsFile}.handlebars`)
  const content = template(params)
  $(element).html(content)
}

// replaceView(element, hbsFile, params)
// renders the template and replaces the element

const replaceView = (element, hbsFile, params) => {
  const template = require(`./templates/${hbsFile}.handlebars`)
  const content = template(params)
  $(element).replaceWith(content)
}

// appendView(element, filepath, params)
// renders the template and appends it to the element

const appendView = (element, hbsFile, params) => {
  const template = require(`./templates/${hbsFile}.handlebars`)
  const content = template(params)
  $(element).append(content)
}

// prependView(element, filepath, params)
// renders the template and appends it to the element

const prependView = (element, hbsFile, params) => {
  const template = require(`./templates/${hbsFile}.handlebars`)
  const content = template(params)
  $(element).prepend(content)
}

// clearView(element)
// clears the html from the specified element

const clearView = (element) => {
  $(element).html('')
}

//
// PUBLIC AND PRIVATE MODES
//

// setPublicMode()
// set public mode for navbar and content area

const setPublicMode = () => {
  // closeAlert()
  renderView('.navbar-div', 'nav-public')
  renderView('.content-div', 'form-auth')
  clearView('.temp-div')
}

const setPrivateMode = () => {
  // closeAlert()
  renderView('.navbar-div', 'nav-private')
  // initTempView()
}

//
// VALIDATION & ALERT METHODS
//

// formAlert(form, field)
// triggers form input validation alert

const formAlert = (form, field) => {
  clearFormAlerts(form)
  // apply alert classes to specfic input
  $(field).closest('.form-group').addClass('has-warning has-feedback')
  // add alert icon to specific input
  $(field).closest('.input-group').find('.form-control').after(`<span class="glyphicon glyphicon-warning-sign form-control-feedback"></span>`)
  // show help text for specific input
  $(field).closest('.form-group').find('.help-block').show()
}

// clearFormFields(form)
// clear all values from form fields

const clearForm = (form) => {
  // clear form field alerts
  clearFormAlerts(form)
  // clear field values
  $(form).find('.form-control').val('')
}

// clearFormAlerts(form)
// clear all feedback classes and icons from form fields

const clearFormAlerts = (form) => {
  // clear all alert classes from inputs
  $(form).find('.form-group').removeClass('has-warning has-feedback')
  // remove all alert class icons from inputs
  $(form).find('.form-group .form-control-feedback').remove()
  // hide any visible help text
  $(form).find('.help-block').hide()
}

// showAlert(mode, message)
// displays global alert box for info or warning

const showAlert = (mode, message) => {
  // convert mode label to bootstrap class
  mode = (mode === 'error') ? 'danger' : 'info'
  // if there's already an alert
  if ($('.alert').length) {
    // replace the existing alert
    replaceView('.alert', 'alert', { mode: mode, message: message })
  } else {
    // insert a new alert
    prependView('.content-div', 'alert', { mode: mode, message: message })
  }
}

// closeError()
// close global error box but not info alerts

const closeError = () => {
  $('.alert-danger').alert('close')
}

// closeAlert()
//  close all global alert boxes

const closeAlert = () => {
  $('.alert').alert('close')
}

// showChangePasswordSuccess()
// password changed successfully

const showChangePasswordSuccess = () => {
  // collapse change password dropdown
  $('#change-password-nav').dropdown('toggle')
  $('.navbar-collapse').collapse('hide')
  // clear change password form fields
  $('#change-password input').val('')
  // display successful alert message
  showAlert('info', 'Your password is changed. Hope you remember it.')
}

// showChangePasswordFailure()
// password change failed

const showChangePasswordFailure = () => {
  // collapse change password dropdown
  $('#change-password-nav').dropdown('toggle')
  $('.navbar-collapse').collapse('hide')
  // clear change password form fields
  $('#change-password input').val('')
  // display successful alert message
  showAlert(`error`, `For highly complex reasons, your password couldn't be changed.`)
}

const showUpload = () => {
  // render handlebars template with data-id for item
  // appendView('body', 'modal-upload')

  // if there's already a modal
  if ($('#upload-modal').length) {
   // replace the existing modal
    replaceView('#upload-modal', 'modal-upload')
  } else {
     // insert a new alert
    appendView('body', 'modal-upload')
  }

  // show the hidden modal
  $('#upload-modal').modal('show')
}

const showUpdate = (data) => {
  if ($('#update-modal').length) {
  //  replace theexisting modal
    replaceView('#update-modal', 'modal-update', {file: data})
  } else {
   // insert a new alert
    appendView('body', 'modal-update', {file: data})
  }
  // show the hidden modal
  $('#update-modal').modal('show')
}

// const showImage = (data) => {
//   if ($('#image-modal').length) {
//   //  replace theexisting modal
//     replaceView('#image-modal', 'modal-update', {file: data})
//   } else {
//    // insert a new alert
//     appendView('body', 'modal-update', {file: data})
//   }
//   // show the hidden modal
//   $('#image-modal').modal('show')
// }

const showFiles = (files) => {
  // first, let's alphabetize the files
  files.sort(function (a, b) {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
  })

  files.forEach(function (e) {
    const time = new Date(e.updatedAt)
    let finalString = time.toLocaleDateString() + ' ' + time.toLocaleTimeString().replace(/:\d\d /, '')
    e.updatedAt = finalString
    finalString = time.toLocaleDateString() + ' ' + time.toLocaleTimeString().replace(/:\d\d /, '')
    e.createdAt = finalString
  })

  renderView('.content-div', 'files', {data: {files: files, userID: store.user.id}})
  $('#table-view').DataTable()
}

const showConfirmDelete = (id) => {
  if ($('#delete-modal').length) {
  //  replace theexisting modal
    replaceView('#delete-modal', 'modal-confirm-delete', {id: id})
  } else {
   // insert a new alert
    appendView('body', 'modal-confirm-delete', {id: id})
  }
  // show the hidden modal
  $('#delete-modal').modal('show')
}

const addHandlers = () => {
  // event handler for clicking the 'upload' button in the nav
  $('.navbar-div').on('click', '#show-upload-button', () => {
    showUpload()
  })

  // event handler for clicking the 'update' button on a file
  $('.content-div').on('click', '#each-file-update', (event) => {
    const data = {
      id: $(event.target).closest('tr').data('id'),
      title: $(event.target).closest('tr').find('.file-name').text()
    }
    showUpdate(data)
  })

  // DROPDOWN MENU EVENTS
  // add animation to dropdown expand
  $('.navbar-div').on('show.bs.dropdown', '.dropdown', (event) => {
    $(event.target).find('.dropdown-menu').first().stop(true, true).slideDown(250)
  })

  // add animation to dropdown collapse
  $('.navbar-div').on('hide.bs.dropdown', '.dropdown', (event) => {
    event.preventDefault()
    $(event.target).find('.dropdown-menu').first().stop(true, true).slideUp(
      250, () => {
        // close dropdown menu
        $('.dropdown').removeClass('open')
        $('.dropdown').find('.dropdown-toggle').attr('aria-expanded', 'false')
        // clear fields
        clearForm($(event.target).find('.form').val('id'))
      })
  })
}

module.exports = {
  initView,
  setPublicMode,
  setPrivateMode,
  showAlert,
  formAlert,
  clearForm,
  clearFormAlerts,
  closeError,
  closeAlert,
  showChangePasswordSuccess,
  showChangePasswordFailure,
  showUpload,
  showFiles,
  showConfirmDelete
}
