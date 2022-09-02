/*
 * Axelor Business Solutions
 *
 * Copyright (C) 2005-2022 Axelor (<http://axelor.com>).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
package com.axelor.meta.loader;

import com.axelor.event.Observes;
import com.axelor.events.ShutdownEvent;
import com.axelor.events.StartupEvent;

public class ViewWatcherObserver {

  public void onAppStart(@Observes StartupEvent event) {
    ViewWatcher.getInstance().start();
  }

  public void onAppShutdown(@Observes ShutdownEvent event) {
    ViewWatcher.getInstance().stop();
  }
}