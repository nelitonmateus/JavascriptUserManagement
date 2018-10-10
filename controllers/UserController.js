 class UserController {

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onEdit();
        this.onSubmit();
    }

    onSubmit(){

        this.formEl.addEventListener('submit', e=>{

            e.preventDefault();

            let btn = this.formEl.querySelector('[type=submit]');

            btn.disabled = true;
            
            let values = this.getValues();

            if (!values) return false;

            this.getPhoto().then(
                content=>{
                    values.photo = content;
                    this.addLine(values);

                    this.formEl.reset();

                    btn.disabled = false;
                },
                error=>{
                    console.error(error);
                }
            );
        
        });

    } //End of onSubmit

    onEdit(){

        document.querySelector('#btn-edit-cancel').addEventListener('click',e=>{
            this.showPanelCreate();
        });

    }

    showPanelCreate(){

        document.querySelector("#box-user-update").style.display = 'none';
        document.querySelector("#box-user-create").style.display = 'block';

    }

    showPanelUpdate(){
        
        document.querySelector("#box-user-update").style.display = 'block';
        document.querySelector("#box-user-create").style.display = 'none';
        
    }

    addLine(dataUser){
      
        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML =  `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${dataUser.register.toLocaleDateString()}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
    
        tr.querySelector('.btn-edit').addEventListener('click', e=>{

            let json = JSON.parse(tr.dataset.user);

            let formEdit = document.querySelector('#form-user-update');

            for (let item in json) {
                let field = formEdit.querySelector('[name=' + item.replace('_', '') + ']');

                if (field) {
                    switch (field.type) {
                        case 'file':
                            continue;

                        case 'radio':
                            field = formEdit.querySelector('[name=' + item.replace('_', '') + '][value=' + json[item] + ']');
                            field.checked = true;
                            break;

                        case 'checkbox':
                            field.checked = json[item];
                            break;
                        default:
                            field.value = json[item];
                    }
                }

            }

            this.showPanelUpdate();
        });

        this.tableEl.appendChild(tr);

        this.updateCount();

    } //End of addLine
        
    getValues(){
            
        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach(e=>{

            //Verify if exists a field with name with no value
            if(['name', 'email', 'password'].indexOf(e.name) > -1 && !e.value){
                
                //Get parent of field, and put an error class
                field.parentElement.classList.add('has-error');
                isValid = false;

            }

            
            if(e.name == "gender" && e.checked){
                user[e.name] = e.value;
            }else if (e.name == "admin") {
                user[e.name] = e.checked
            }else{
                user[e.name] = e.value;
            }
        
        });

        if (!isValid) return false;

        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

    } //End of getValues

    getPhoto(){

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item=>{
    
                if(item.name === 'photo') return item;
    
            });
    
            let file = elements[0].files[0];
    
            fileReader.onload = ()=>{
    
                resolve(fileReader.result);
    
            };
    
            fileReader.onerror = (e)=>{

                reject(e);

            }
    
            file ? fileReader.readAsDataURL(file) : resolve('dist/img/boxed-bg.jpg');

        });

    }// End of getPhoto


    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;

        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;

    }//End of updateCount

}