class UserController {

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

    }

    onSubmit(){

        this.formEl.addEventListener('submit', e=>{

            e.preventDefault();

            let btn = this.formEl.querySelector('[type=submit]');

            btn.disabled = true;
            
            let values = this.getValues();

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

    addLine(dataUser){
      
        let tr = document.createElement('tr');

        tr.innerHTML =  `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${dataUser.register.toLocaleDateString()}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
    
        this.tableEl.appendChild(tr);

    } //End of addUser
        
    getValues(){
            
        let user = {};

        [...this.formEl.elements].forEach(e=>{

            if(e.name == "gender" && e.checked){
                user[e.name] = e.value;
            }else if (e.name == "admin") {
                user[e.name] = e.checked
            }else{
                user[e.name] = e.value;
            }
        
        });

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

}