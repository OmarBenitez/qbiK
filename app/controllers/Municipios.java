package controllers;

import java.util.List;
import models.Estado;
import models.Municipio;

/**
 *
 * @author omar
 */
public class Municipios extends CRUD {

    public static void json(String clave) {

        Estado e = Estado.find("clave", clave).first();
        List<Municipio> municipios = Municipio.find("estado", e).asList();
        renderJSON(Municipio.toJsonListSerializer().serialize(municipios));

    }

}
