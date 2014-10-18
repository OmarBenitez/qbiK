/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package models;

import com.google.code.morphia.annotations.Entity;
import play.modules.morphia.Model;

/**
 *
 * @author omar
 */
@Entity
public class Usuario extends Model{
    
    public String email;
    
    public String username;
    
    public String password;

    public Usuario(String email, String username, String password) {
        this.email = email;
        this.username = username;
        this.password = password;
    }
    
}
