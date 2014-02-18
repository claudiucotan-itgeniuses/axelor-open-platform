/**
 * Copyright (c) 2012-2014 Axelor. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://license.axelor.com/.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is part of "Axelor Business Suite", developed by
 * Axelor exclusively.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of
 * the Original Code is Axelor.
 *
 * All portions of the code written by Axelor are
 * Copyright (c) 2012-2014 Axelor. All Rights Reserved.
 */
package com.axelor.meta.schema.views;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElements;
import javax.xml.bind.annotation.XmlType;

import com.fasterxml.jackson.annotation.JsonTypeName;

@XmlType
@JsonTypeName("portal")
public class Portal extends AbstractView {
	
	@XmlAttribute
	private Integer cols;

	@XmlElements({
		@XmlElement(name = "portlet", type = Portlet.class),
		@XmlElement(name = "tabs", type = PortalTabs.class)
	})
	private List<AbstractContainer> items;

	public Integer getCols() {
		return cols;
	}
	
	public void setCols(Integer cols) {
		this.cols = cols;
	}

	public List<AbstractContainer> getItems() {
		return items;
	}

	@XmlType
	@JsonTypeName("tabs")
	public static class PortalTabs extends AbstractContainer {

		@XmlElement(name = "tab")
		private List<Portal> tabs;
		
		public List<Portal> getTabs() {
			return tabs;
		}

		public void setTabs(List<Portal> tabs) {
			this.tabs = tabs;
		}
	}
}
