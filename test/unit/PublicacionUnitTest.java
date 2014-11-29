package unit;

import java.time.Instant;
import java.util.Date;
import models.Comentario;
import models.Estado;
import models.Municipio;
import models.Publicacion;
import models.Usuario;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
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
public class PublicacionUnitTest extends UnitTest{
    @Before
    public void setBefore(){
        Usuario.deleteAll();
        Estado.deleteAll();
        Municipio.deleteAll();
        Comentario.deleteAll();
        Publicacion.deleteAll();
    }

    @Test
    public void testPublicacion() {

        String claveEstado = "6",
                nombreEstado = "Chihuahua",
                email = "test@test.com",
                email2 = "test2@test2.com",
                nombre = "Chabelo",
                nombre2 = "Chespirito",
                password = "1234",
                password2 = "4321",
                claveMunicipio = "180",
                nombreMunicipio = "CHIHUAHUA",
                contenido = "contenido",
                contenido2 = "contenido2",
                titulo = "Titulo1",
                titulo2 = "Titulo2";

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
        
        Comentario comentario = new Comentario();
        comentario.usuario = usuario;
        comentario.contenido = contenido;
        comentario.fechaPublicacion = Date.from(Instant.now());
        
        Publicacion publicacion = new Publicacion();
        publicacion.titulo = titulo;
        publicacion.contenido = contenido;
        publicacion.usuario = usuario;

        //Probar validaciones
        //publicacion
        publicacion.titulo = null; 
        assertFalse("No se debe guardar un usuario nulo",
                publicacion.validateAndSave());
        
        publicacion.titulo = titulo;
        
        //Update
        //titulo    
        publicacion.titulo = titulo2;
//        assertTrue("Se debe guardar el titulo editado",
//                publicacion.validateAndSave());
        assertEquals("Se debe haber actualizado", titulo2, publicacion.titulo);

        //delete
        usuario.delete();
        comentario.delete();
        estado.delete();
        municipio.delete(); 
        publicacion.delete();

        assertNull("Se debe poder borrar comentario",
                Publicacion.find("titulo", titulo).first());

    }
    

}
