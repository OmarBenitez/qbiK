/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package unit;

import models.Estado;
import models.Municipio;
import models.Usuario;
import org.junit.Before;
import org.junit.Test;
import play.test.UnitTest;

/**
 *
 *
 * @author Oscar Raul Gutierrez Almanza
 * @version 1
 * @since Nov 29, 2014
 * @see
 */
public class UsuarioUnitTest extends UnitTest {
    
    @Before
    public void setBefore(){
        Usuario.deleteAll();
    }

    @Test
    public void testUsuario() {

        String claveEstado = "6",
                nombreEstado = "Chihuahua",
                email = "test@test.com",
                email2 = "test2@test2.com",
                nombre = "Chabelo",
                nombre2 = "Chespirito",
                password = "1234",
                password2 = "4321",
                claveMunicipio = "180",
                nombreMunicipio = "CHIHUAHUA";

        Estado estado = new Estado(claveEstado, nombreEstado);
        estado.clave = claveEstado;
        estado.nombre = nombreEstado;
        assertTrue("Se debe poder guardar un estado",
                estado.validateAndSave());

        Municipio municipio
                = new Municipio(claveMunicipio, nombreMunicipio, Integer.SIZE);
        municipio.clave = claveMunicipio;
        municipio.nombre = nombreMunicipio;
        municipio.estado = estado;
        assertTrue("Se debe poder guardar un municipio",
                municipio.validateAndSave());

        Usuario usuario = new Usuario();
        usuario.email = email;
        usuario.nombre = nombre;
        usuario.password = password;
        usuario.ciudad = municipio;
        assertTrue("Se debe poder guardar un usuario",
                usuario.validateAndSave());
        

        //Probar Unique
        Usuario usuario2 = new Usuario();
        usuario2.email = usuario.email;
        assertFalse("El email de un usuario debe ser unico",
                usuario2.validateAndSave());

        usuario2.email = email2;
        usuario2.nombre = nombre2;
        usuario2.password = password2;
        assertTrue("Debe poderse guardar otro email valido",
                usuario2.validateAndSave());

        //Probar validaciones
        //email
        usuario.email = null;
        assertFalse("No se debe guardar un email nulo",
                usuario.validateAndSave());
        System.out.println(usuario.email);
        usuario.email = "";
        assertFalse("No se debe guardar un email vacio",
                usuario.validateAndSave());
        usuario.email = email;
        //nombre
        usuario.nombre = null;
        assertFalse("No se debe guardar un nombre nulo",
                usuario.validateAndSave());
        usuario.nombre = "";
        assertFalse("No se debe guardar un nombre vacio",
                usuario.validateAndSave());
        usuario.nombre = nombre;
        //password
        usuario.password = null;
        assertFalse("No se debe guardar una password nula",
                usuario.validateAndSave());
        usuario.password = "";
        assertFalse("No se debe guardar una password vacia",
                usuario.validateAndSave());
        usuario.password = password;

        //Update
        //nombre
        usuario.nombre = nombre2;
        assertTrue("Se debe guardar el nombre editado",
                usuario.validateAndSave());
        assertEquals("Se debe haber actualizado", nombre2, usuario.nombre);
        //password
        usuario.password = password2;
        assertTrue("Se debe guardar el nombre editado",
                usuario.validateAndSave());
        assertEquals("Se debe haber actualizado", password2, usuario.password);

        //delete
        usuario.delete();
        usuario2.delete();

        assertNull("Se debe poder borrar usuario",
                Usuario.find("email", email).first());
        assertNull("Se debe poder borrar usuario2",
                Usuario.find("email", email2).first());

    }

}
